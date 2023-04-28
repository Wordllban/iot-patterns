-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_vacancyId_fkey";

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
