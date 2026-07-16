ALTER TABLE learning_path_steps
	ADD COLUMN IF NOT EXISTS id text;

UPDATE learning_path_steps
SET id = path_id || '-step-' || step_order::text
WHERE id IS NULL OR id = '';

ALTER TABLE learning_path_steps
	ALTER COLUMN id SET NOT NULL;

ALTER TABLE learning_path_steps
	DROP CONSTRAINT IF EXISTS learning_path_steps_pkey;

ALTER TABLE learning_path_steps
	ADD PRIMARY KEY (id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_learning_path_steps_path_order
	ON learning_path_steps (path_id, step_order);
