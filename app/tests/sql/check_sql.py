"""Run every SQL example in data/lookups/patterns.json against a small shop
and check the answer. Each expected answer was worked out by hand from the
rows below.

Run from the folder that holds app/ and data/ (the public repo root, or
apps/metric-patterns in the monorepo), with any Python that has duckdb:

    pip install duckdb
    python app/tests/sql/check_sql.py

"Today" is fixed at 2026-05-20: CURRENT_DATE in an example is replaced with
that date, so the time-based answers do not change from day to day.
"""
import json
import sys
from decimal import Decimal
from pathlib import Path

import duckdb

TODAY = "DATE '2026-05-20'"
HERE = Path(__file__).resolve().parent
CONTENT = HERE.parents[2] / "data" / "lookups" / "patterns.json"

SETUP = """
CREATE TABLE products(product_id INT, brand TEXT, category TEXT, cost DECIMAL(10,2));
INSERT INTO products VALUES (1,'Acme','Shirts',10),(2,'Acme','Shoes',30),(3,'Bolt','Shirts',12),
  (4,'Crest','Hats',5),(5,'Dune','Hats',6);
CREATE TABLE customers(customer_id INT, city TEXT, region TEXT, tier TEXT);
INSERT INTO customers VALUES (1,'Auckland','North','Gold'),(2,'Hamilton','North','Silver'),
  (3,'Wellington','South','Silver'),(4,'Christchurch','South','Bronze'),(5,'Tauranga','North','Bronze');
CREATE TABLE order_items(order_id INT, customer_id INT, product_id INT, unit_price DECIMAL(10,2),
  quantity INT, sale_price DECIMAL(10,2), status TEXT, order_date DATE, ship_date DATE);
-- product 99 is not in products: an item with no match
INSERT INTO order_items VALUES
 (101,1,1,20,1,20,'Complete','2026-01-05','2026-01-07'),
 (101,1,2,30,2,60,'Complete','2026-01-05','2026-01-08'),
 (102,2,3,25,1,25,'Returned','2026-01-20','2026-01-22'),
 (103,1,4,5,3,15,'Complete','2026-02-02','2026-02-04'),
 (104,3,1,20,1,20,'Cancelled','2026-03-03',NULL),
 (105,3,5,9,2,18,'Complete','2026-03-10','2026-03-12'),
 (106,4,2,60,1,60,'Complete','2026-03-28','2026-04-01'),
 (107,4,99,40,1,40,'Complete','2026-05-15','2026-05-16'),
 (108,2,1,20,1,20,'Complete','2025-02-10','2025-02-12'),
 (109,3,3,6.25,4,25,'Complete','2026-04-12','2026-04-13'),
 (110,5,4,3,1,3,'Complete','2026-04-20','2026-04-21');
CREATE TABLE sessions(session_id INT, session_date DATE);
INSERT INTO sessions SELECT i, DATE '2026-01-01' + CAST(i AS INT) FROM range(40) t(i);
CREATE TABLE stock(product_id INT, snapshot_date DATE, units_on_hand INT);
INSERT INTO stock VALUES (1,'2026-03-30',10),(2,'2026-03-30',4),(1,'2026-03-31',8),(2,'2026-03-31',5);
CREATE TABLE budget(month DATE, amount DECIMAL(10,2));
INSERT INTO budget VALUES ('2026-01-01',100),('2026-02-01',50),('2026-03-01',120),('2026-04-01',90),('2026-06-01',80);
CREATE TABLE calendar(date DATE);
INSERT INTO calendar SELECT CAST(d AS DATE) FROM range(DATE '2025-01-01', DATE '2026-12-31', INTERVAL 1 DAY) t(d);
CREATE TABLE calendar_months AS
  SELECT DISTINCT CAST(DATE_TRUNC('month', date) AS DATE) AS month FROM calendar
  WHERE date BETWEEN '2026-01-01' AND '2026-06-30';
CREATE TABLE customer_history(customer_id INT, tier TEXT, valid_from DATE, valid_to DATE);
INSERT INTO customer_history VALUES (1,'Silver','2020-01-01','2026-02-01'),(1,'Gold','2026-02-01','9999-12-31'),
  (2,'Silver','2020-01-01','9999-12-31'),(3,'Bronze','2020-01-01','2026-04-01'),(3,'Silver','2026-04-01','9999-12-31'),
  (4,'Bronze','2020-01-01','9999-12-31'),(5,'Bronze','2020-01-01','9999-12-31');
"""


def near(a, b):
    return a is not None and abs(float(a) - float(b)) < 1e-9


def one(rows):
    return rows[0][0]


def key(value):
    """A date or timestamp as YYYY-MM-DD, so DATE and TIMESTAMP results compare the same"""
    if value is None or isinstance(value, str):
        return value
    return str(value)[:10]


def by_key(rows):
    return {key(r[0]): r[1:] if len(r) > 2 else r[1] for r in rows}


EXPECT = {
    "sum": lambda r: one(r) == 306,
    "count": lambda r: one(r) == 11,
    "distinct-count": lambda r: one(r) == 5,
    "smallest-and-largest": lambda r: str(r[0][0]) == "2025-02-10" and r[0][1] == 60,
    "average-of-a-value": lambda r: near(one(r), 306 / 11),
    "middle-value": lambda r: near(one(r), 22.5),
    "filtered-measure": lambda r: one(r) == 261,
    "default-exclusions": lambda r: one(r) == 261,
    "conditional-count": lambda r: one(r) == 1,
    "ratio": lambda r: near(one(r), 30.6),
    "rate": lambda r: near(one(r), 1 / 11),
    "ratio-across-two-tables": lambda r: near(one(r), (306 - 212) / 306),
    "weighted-average": lambda r: near(one(r), 17),
    "metric-built-from-metrics": lambda r: r[0][0] == 5 and near(r[0][1], 2) and near(r[0][2], 30.6),
    "share-of-total": lambda r: near(by_key(r)["Acme"], 180 / 306) and near(sum(float(x[1]) for x in r), 1),
    "a-wider-total-on-narrower-rows": lambda r: {(x[1], x[3]) for x in r}
        == {("Auckland", 143), ("Hamilton", 143), ("Tauranga", 143), ("Wellington", 163), ("Christchurch", 163)},
    "top-n-and-rank": lambda r: [(x[0], x[2]) for x in r] in (
        [("Acme", 1), ("Bolt", 2), ("Crest", 3), ("Dune", 3)], [("Acme", 1), ("Bolt", 2), ("Dune", 3), ("Crest", 3)]),
    "time-window": lambda r: one(r) == 40,
    "period-to-date": lambda r: one(r) == 286,
    "period-over-period": lambda r: dict(r)[2025] is None and near(dict(r)[2026], 286 / 20 - 1),
    "running-total": lambda r: [float(x[1]) for x in r] == [20, 125, 140, 238, 266, 306],
    "rolling-average": lambda r: by_key(r)["2025-01-06"] is None and near(by_key(r)["2025-01-07"], 0)
        and near(by_key(r)["2026-01-11"], 80 / 7) and by_key(r)["2026-01-12"] == 0,
    "one-measure-a-second-date": lambda r: sum(x[1] for x in r) == 306 and by_key(r)[None] == 20,
    "periods-with-nothing-in-them": lambda r: len(r) == 6 and by_key(r)["2026-06-01"] in (None, 0),
    "distinct-count-across-a-split": lambda r: by_key(r) == {None: 5, "Shirts": 3, "Shoes": 2, "Hats": 3, "No category": 1},
    "balance-at-a-point-in-time": lambda r: one(r) == 13,
    "a-total-line-worked-out-again": lambda r: near(by_key(r)[None], 1 / 11) and near(by_key(r)["Shirts"], 0.2),
    "two-events-at-two-levels": lambda r: near(one(r), 0.25),
    "actual-against-a-target": lambda r: {k: float(v) for k, v in by_key(r).items()}
        == {"2025-02-01": 20, "2026-01-01": 5, "2026-02-01": -35, "2026-03-01": -22,
            "2026-04-01": -62, "2026-05-01": 40, "2026-06-01": -80},
    "a-measure-over-a-measure": lambda r: near(one(r), 0.8),
    "cohort": lambda r: near(by_key(r)["2026-01-01"], 1) and near(by_key(r)["2025-02-01"], 0)
        and near(by_key(r)["2026-03-01"], 0.5) and by_key(r)["2026-04-01"] is None,
    "a-detail-as-it-was-then": lambda r: {x[0]: x[1] for x in r} == {"Gold": 15, "Silver": 150, "Bronze": 141},
}


def main() -> int:
    content = json.loads(CONTENT.read_text())
    con = duckdb.connect()
    con.execute(SETUP)
    failures = 0
    for v in content["patterns"]:
        sql = v["examples"]["sql"].replace("CURRENT_DATE", TODAY)
        check = EXPECT.get(v["id"])
        try:
            rows = con.execute(sql).fetchall()
            ok = check is not None and check(rows)
        except Exception as e:  # noqa: BLE001 - report every failure, keep going
            rows, ok = str(e).splitlines()[0], False
        if not ok:
            failures += 1
            reason = "no expected answer written" if check is None else rows
            print(f"FAIL {v['id']}: {reason}")
        else:
            print(f"ok   {v['id']}")
    print(f"\n{len(content['patterns']) - failures} of {len(content['patterns'])} passed on DuckDB {duckdb.__version__}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
