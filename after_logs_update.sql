CREATE TRIGGER `after_logs_update` BEFORE UPDATE ON `logs` FOR EACH ROW BEGIN
CALL insert_missing_formcontents(NEW.logid, NEW.jobid, NEW.userid, NEW.jsoncontent);
END
