-- Add resultId column to quizAnswers table
ALTER TABLE "quizAnswers" ADD COLUMN "resultId" integer;

-- Add foreign key constraint
ALTER TABLE "quizAnswers" ADD CONSTRAINT "quizAnswers_resultId_quizResults_id_fk" 
FOREIGN KEY ("resultId") REFERENCES "quizResults"("id") ON DELETE cascade ON UPDATE no action;
