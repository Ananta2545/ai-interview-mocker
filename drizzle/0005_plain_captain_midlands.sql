ALTER TABLE "quizQuestions" RENAME COLUMN "topic" TO "quizId";--> statement-breakpoint
ALTER TABLE "quizQuestions" ADD CONSTRAINT "quizQuestions_quizId_quizzes_id_fk" FOREIGN KEY ("quizId") REFERENCES "public"."quizzes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizQuestions" DROP COLUMN "level";