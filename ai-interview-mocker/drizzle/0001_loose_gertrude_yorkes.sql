CREATE TABLE "quizAnswers" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"questionId" integer NOT NULL,
	"selectedAnswer" text NOT NULL,
	"isCorrect" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quizQuestions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"questionText" text NOT NULL,
	"options" jsonb NOT NULL,
	"correctAnswer" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "quizAnswers" ADD CONSTRAINT "quizAnswers_questionId_quizQuestions_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."quizQuestions"("id") ON DELETE no action ON UPDATE no action;