# Connecting to Databases Notes

## Checkpoints

1. Import `sqlite3`, create `init_database()` with `st.connection("sentiment_db", type="sql", url="sqlite:///data/sentiment_analysis.db")`, and store the connection as `st.session_state.db_conn`.
2. Use SQL queries to count all rows and sentiment totals.
3. When `save_to_db` is checked, save individual text analysis results with `save_to_database()`.
4. Add a database tab, load records with `load_from_database()`, show metrics, and preview rows with `db_df.head()`.

## Codecademy File

Paste `sentiment_app.py` into Codecademy's `sentiment_app.py`.

