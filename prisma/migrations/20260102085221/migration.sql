-- CreateTable
CREATE TABLE "QuestionOption" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT,
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "form_id" TEXT NOT NULL,
    "responderId" TEXT,
    "publicToken" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponseAnswer" (
    "id" TEXT NOT NULL,
    "response_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "option_id" TEXT,
    "value_text" TEXT,

    CONSTRAINT "ResponseAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuestionOption_question_id_idx" ON "QuestionOption"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionOption_question_id_order_index_key" ON "QuestionOption"("question_id", "order_index");

-- CreateIndex
CREATE INDEX "Response_form_id_idx" ON "Response"("form_id");

-- CreateIndex
CREATE INDEX "Response_publicToken_idx" ON "Response"("publicToken");

-- CreateIndex
CREATE INDEX "ResponseAnswer_question_id_idx" ON "ResponseAnswer"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "ResponseAnswer_response_id_question_id_key" ON "ResponseAnswer"("response_id", "question_id");

-- AddForeignKey
ALTER TABLE "QuestionOption" ADD CONSTRAINT "QuestionOption_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseAnswer" ADD CONSTRAINT "ResponseAnswer_response_id_fkey" FOREIGN KEY ("response_id") REFERENCES "Response"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseAnswer" ADD CONSTRAINT "ResponseAnswer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseAnswer" ADD CONSTRAINT "ResponseAnswer_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "QuestionOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;
