CREATE TABLE "quizResults" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"quizId" integer NOT NULL,
	"score" integer NOT NULL,
	"totalQuestions" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "quizResults" ADD CONSTRAINT "quizResults_quizId_quizzes_id_fk" FOREIGN KEY ("quizId") REFERENCES "public"."quizzes"("id") ON DELETE no action ON UPDATE no action;