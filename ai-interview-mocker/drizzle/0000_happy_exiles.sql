CREATE TABLE "mockInterview" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"jsonMockResp" jsonb NOT NULL,
	"jobPosition" varchar(255) NOT NULL,
	"jobDesc" text NOT NULL,
	"jobExperience" integer NOT NULL,
	"createdBy" varchar(255) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"mockId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userAnswers" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"interviewId" integer NOT NULL,
	"questionIndex" integer NOT NULL,
	"answerText" text NOT NULL,
	"transcript" text NOT NULL,
	"evaluationScore" integer,
	"evaluationReport" jsonb,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "userAnswers" ADD CONSTRAINT "userAnswers_interviewId_mockInterview_id_fk" FOREIGN KEY ("interviewId") REFERENCES "public"."mockInterview"("id") ON DELETE no action ON UPDATE no action;