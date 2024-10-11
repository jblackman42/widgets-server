SELECT
  Contacts.Contact_ID,
  Contacts.First_Name,
  Contacts.Last_Name,
  Contacts.Nickname,
  Group_Participants.Job_Title,
  Teams.Team_Name,

  CASE 
    WHEN F.Unique_Name IS NOT NULL THEN 
      CONCAT('https://my.pureheart.org/ministryplatformapi/files/', CONVERT(varchar(36), F.Unique_Name))
    ELSE 
      NULL
  END AS Profile_Picture_URL

FROM Group_Participants
  INNER JOIN Participants ON Group_Participants.Participant_ID = Participants.Participant_ID
  INNER JOIN Contacts ON Participants.Contact_ID = Contacts.Contact_ID
  LEFT JOIN Staff ON Contacts.Staff_Record = Staff.Staff_ID
  LEFT JOIN Teams ON Group_Participants.Team_ID = Teams.Team_ID
  LEFT JOIN dp_Files F ON Contacts.Contact_ID = F.Record_ID AND F.Page_ID = 292 AND F.Default_Image = 1
WHERE Group_ID = 2473 --id of staff group
  AND (Group_Participants.End_Date > GETDATE() OR Group_Participants.End_Date IS NULL)
  AND Teams.Team_Name IS NOT NULL