"use strict";

const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const db = new DatabaseSync(path.join(__dirname, "reviews.db"));

// Schema ---------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS reviews (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    language         TEXT    NOT NULL,
    score            INTEGER NOT NULL,
    total_issues     INTEGER NOT NULL,
    security         INTEGER NOT NULL,
    performance      INTEGER NOT NULL,
    quality          INTEGER NOT NULL,
    time_complexity  TEXT    NOT NULL DEFAULT 'N/A',
    space_complexity TEXT    NOT NULL DEFAULT 'N/A',
    summary          TEXT    NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS issues (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    review_id  INTEGER NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    line       INTEGER,
    severity   TEXT    NOT NULL,
    message    TEXT    NOT NULL,
    suggestion TEXT    NOT NULL
  );
`);

// Add columns to existing databases that predate this migration
for (const [col, def] of [
  ["time_complexity",  "TEXT NOT NULL DEFAULT 'N/A'"],
  ["space_complexity", "TEXT NOT NULL DEFAULT 'N/A'"],
  ["summary",          "TEXT NOT NULL DEFAULT ''"],
]) {
  try { db.exec(`ALTER TABLE reviews ADD COLUMN ${col} ${def}`); }
  catch (_) { /* already exists */ }
}

// Prepared statements --------------------------------------------------
const insertReview = db.prepare(`
  INSERT INTO reviews (language, score, total_issues, security, performance, quality, time_complexity, space_complexity, summary)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertIssue = db.prepare(`
  INSERT INTO issues (review_id, line, severity, message, suggestion)
  VALUES (?, ?, ?, ?, ?)
`);

const selectHistory = db.prepare(`
  SELECT id, created_at, language, score, total_issues, security, performance, quality,
         time_complexity, space_complexity, summary
  FROM reviews
  ORDER BY id DESC
`);

const selectReview = db.prepare(`
  SELECT id, created_at, language, score, total_issues, security, performance, quality,
         time_complexity, space_complexity, summary
  FROM reviews
  WHERE id = ?
`);

const selectIssues = db.prepare(`
  SELECT line, severity, message, suggestion
  FROM issues
  WHERE review_id = ?
  ORDER BY id ASC
`);

// Public helpers -------------------------------------------------------

/**
 * Save a completed review + its issues in a single transaction.
 * Returns the new review id.
 */
function saveReview({ language, score, counts, issues, timeComplexity = "N/A", spaceComplexity = "N/A", summary = "" }) {
  db.exec("BEGIN");
  try {
    const info = insertReview.run(
      language,
      score,
      issues.length,
      counts.security,
      counts.performance,
      counts.quality,
      timeComplexity,
      spaceComplexity,
      summary
    );
    const reviewId = info.lastInsertRowid;
    for (const issue of issues) {
      insertIssue.run(reviewId, issue.line ?? null, issue.severity, issue.message, issue.suggestion);
    }
    db.exec("COMMIT");
    return reviewId;
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

/** Return all reviews, newest first (no issues). */
function getHistory() {
  return selectHistory.all();
}

/** Return one review with its issues, or null if not found. */
function getReviewById(id) {
  const review = selectReview.get(id);
  if (!review) return null;
  review.issues = selectIssues.all(id);
  return review;
}

module.exports = { saveReview, getHistory, getReviewById };
