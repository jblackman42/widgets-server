SELECT 
  ps.Sermon_Date, 
  ps.Sermon_ID, 
  ps.Series_ID, 
  ss.Title,
  ss.Subtitle,
  c.Congregation_Name,
  f.Unique_Name
FROM 
  Pocket_Platform_Sermons ps
LEFT JOIN 
  Pocket_Platform_Sermon_Series ss ON ps.Series_ID = ss.Sermon_Series_ID
LEFT JOIN
  Congregations c ON ps.Congregation_ID = c.Congregation_ID
LEFT JOIN
  dp_Files f ON f.Page_ID = 517 
    AND f.Record_ID = ps.Sermon_ID 
    AND f.Default_Image = 1
WHERE 
  ps.Service_Type_ID = '1'
ORDER BY 
  ps.Position DESC