CREATE TABLE "quizzes" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"topic" varchar(255) NOT NULL,
	"level" varchar(50) NOT NULL,
	"questionCount" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now()
);
