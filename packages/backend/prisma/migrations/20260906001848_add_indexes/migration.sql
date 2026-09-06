-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE INDEX "accounts_status_idx" ON "accounts"("status");

-- CreateIndex
CREATE INDEX "accounts_customer_type_idx" ON "accounts"("customer_type");

-- CreateIndex
CREATE INDEX "toll_events_vehicle_id_idx" ON "toll_events"("vehicle_id");

-- CreateIndex
CREATE INDEX "toll_events_plaza_id_idx" ON "toll_events"("plaza_id");

-- CreateIndex
CREATE INDEX "toll_events_entry_time_idx" ON "toll_events"("entry_time");

-- CreateIndex
CREATE INDEX "toll_events_status_idx" ON "toll_events"("status");

-- CreateIndex
CREATE INDEX "toll_events_anpr_plate_idx" ON "toll_events"("anpr_plate");

-- CreateIndex
CREATE INDEX "transactions_account_id_idx" ON "transactions"("account_id");

-- CreateIndex
CREATE INDEX "transactions_event_id_idx" ON "transactions"("event_id");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "transactions"("type");

-- CreateIndex
CREATE INDEX "transactions_created_at_idx" ON "transactions"("created_at");

-- CreateIndex
CREATE INDEX "vehicles_plate_number_idx" ON "vehicles"("plate_number");

-- CreateIndex
CREATE INDEX "vehicles_status_idx" ON "vehicles"("status");

-- CreateIndex
CREATE INDEX "vehicles_approval_status_idx" ON "vehicles"("approval_status");

-- CreateIndex
CREATE INDEX "vehicles_vehicle_class_idx" ON "vehicles"("vehicle_class");

-- CreateIndex
CREATE INDEX "vehicles_created_at_idx" ON "vehicles"("created_at");

-- CreateIndex
CREATE INDEX "violations_vehicle_id_idx" ON "violations"("vehicle_id");

-- CreateIndex
CREATE INDEX "violations_event_id_idx" ON "violations"("event_id");

-- CreateIndex
CREATE INDEX "violations_status_idx" ON "violations"("status");

-- CreateIndex
CREATE INDEX "violations_violation_type_idx" ON "violations"("violation_type");

-- CreateIndex
CREATE INDEX "violations_created_at_idx" ON "violations"("created_at");
