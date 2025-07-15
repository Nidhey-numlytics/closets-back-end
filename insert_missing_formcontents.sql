CREATE PROCEDURE `insert_missing_formcontents`
   (IN p_logid INT,
    IN p_jobid VARCHAR(100),
    IN p_userid INT,
    IN p_json LONGTEXT)
BEGIN
DECLARE v_qty INT;
DECLARE v_count INT DEFAULT 0;
DECLARE v_job_prefix VARCHAR(100);
DECLARE v_new_jobid VARCHAR(100);
DECLARE v_clientName VARCHAR(255);
DECLARE v_projectname VARCHAR(255);
DECLARE v_jsoncontent TEXT;
DECLARE i INT;

-- Extract qty and values from JSON
SET v_qty = CAST(JSON_UNQUOTE(JSON_EXTRACT(p_json, '$.closetsFormCount')) AS UNSIGNED);
SET v_clientName = JSON_UNQUOTE(JSON_EXTRACT(p_json, '$.clientName'));
SET v_projectname = "New *";

-- Get jobid prefix like "396895" from "396895-2"
SET v_job_prefix = SUBSTRING_INDEX(p_jobid, '-', 1);

-- Count existing rows
SELECT COUNT(*) INTO v_count
FROM formcontents
WHERE jobid LIKE CONCAT(v_job_prefix, '-%');

-- Insert missing ones
SET i = v_count + 1;
WHILE i <= v_qty DO
    SET v_new_jobid = CONCAT(v_job_prefix, '-', i);

    SET v_jsoncontent = JSON_OBJECT(
'jobId', v_new_jobid,
'clientName', v_clientName,
'userId', CAST(p_userid AS CHAR),
'projectname', v_projectname,
'sameasabove', false,
'address', '',
'city', '',
'province', '',
'postalCode', '',
'cuttingarea', '',
'collection', '',
'collectionclr', '',
'additionalNotes', '',
'condo', JSON_OBJECT(
'hasCondos', NULL,
'housenumber', ''
),
'existingBoard', JSON_OBJECT(
'notch', false,
'remove', false
),
'doors', JSON_OBJECT(
'sameascollectioncolor', false,
'doorclosetcollection', '',
'doorcolor', '',
'quantity', '',
'decostyle', '',
'series', '',
'variant', '',
'gripType', '',
'gripSeries', '',
'gripSize', '',
'gripColor', ''
),
'drawers', JSON_OBJECT(
'sameascollcolor', false,
'drawerclosetcollection', '',
'drawercolor', '',
'quantity', '',
'decostyle', '',
'series', '',
'variant', '',
'gripType', '',
'gripSeries', '',
'gripSize', '',
'gripColor', ''
),
'rods', JSON_OBJECT(
'quantity', '',
'style', '',
'color', ''
),
'counterTop', JSON_OBJECT(
'type', '',
'color', '',
'edge', ''
),
'moulding', JSON_OBJECT(
'top', '',
'bottom', ''
)
);

    INSERT INTO formcontents (userid, jobid, jsoncontent, isdeleted)
    VALUES (p_userid, v_new_jobid, v_jsoncontent, 0);

    SET i = i + 1;
END WHILE;
END
