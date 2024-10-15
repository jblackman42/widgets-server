WITH UserHousehold AS (
  SELECT TOP 1 C.Household_ID
  FROM dp_Users U
  JOIN Contacts C ON U.Contact_ID = C.Contact_ID
  WHERE U.User_GUID = @userGUID
)
SELECT
  H.Household_ID as householdId,
  H.Household_Name as name,
  H.Home_Phone as homePhone,
  H.Congregation_ID as congregationId,
  Cg.Congregation_Name as congregationName,
  (
    SELECT
      C.Household_Position_ID as householdPositionId,
      HP.Household_Position as householdPositionName,
      C.Middle_Name as middleName,
      C.Nickname as nickname,
      C.Prefix_ID as prefixId,
      C.Suffix_ID as suffixId,
      S.Suffix as suffixName,
      P.Prefix as prefixName,
      C.Date_of_Birth as dateOfBirth,
      C.Gender_ID as genderId,
      C.Marital_Status_ID as maritalStatusId,
      CASE
        WHEN F.Unique_Name IS NULL THEN NULL
        ELSE CONCAT('https://', (SELECT TOP 1 External_Server_Name FROM dp_Domains), '/ministryplatformapi/files/', F.Unique_Name)
      END as imageUrl,
      H.Home_Phone as homePhoneNumber,
      H.Congregation_ID as congregationId,
      C.Bulk_Email_Opt_Out as bulkEmailOptOut,
      C.Email_Unlisted as emailUnlisted,
      C.Mobile_Phone_Unlisted as mobilePhoneUnlisted,
      C.Do_Not_Text as doNotText,
      CAST(CASE WHEN C.Household_Position_ID = 1 THEN 1 ELSE 0 END AS BIT) as isHeadOfHousehold,
      H.Address_ID as addressId,
      C.Remove_From_Directory as removeFromDirectory,
      C.Contact_ID as contactId,
      C.First_Name as firstName,
      C.Last_Name as lastName,
      C.Display_Name as displayName,
      C.Participant_Record as participantId,  
      C.Donor_Record as donorId,
      C.Email_Address as emailAddress,
      C.Mobile_Phone as mobilePhoneNumber,
      C.Company_Phone as workPhoneNumber,
      C.Household_ID as householdId
    FROM Contacts C
    LEFT JOIN Household_Positions HP ON C.Household_Position_ID = HP.Household_Position_ID
    LEFT JOIN Suffixes S ON C.Suffix_ID = S.Suffix_ID
    LEFT JOIN Prefixes P ON C.Prefix_ID = P.Prefix_ID
    LEFT JOIN dp_Files F ON F.Page_ID = 292 AND F.Record_ID = C.Contact_ID AND F.Default_Image = 1
    WHERE C.Household_ID = H.Household_ID
    FOR JSON PATH, INCLUDE_NULL_VALUES
  ) AS familyMembers,
  (
    SELECT TOP 1
      A.Address_ID as addressId,
      A.Address_Line_1 as addressLine1,
      A.Address_Line_2 as addressLine2,
      A.City as city,
      A.[State/Region] as stateRegion,
      A.Postal_Code as postalCode,
      A.Country as country,
      A.Country_Code as countryCode
    FROM Addresses A
    WHERE A.Address_ID = H.Address_ID
    FOR JSON PATH, INCLUDE_NULL_VALUES, WITHOUT_ARRAY_WRAPPER
  ) AS address,
  (
    SELECT TOP 1
      A.Address_ID as addressId,
      A.Address_Line_1 as addressLine1,
      A.Address_Line_2 as addressLine2,
      A.City as city,
      A.[State/Region] as stateRegion,
      A.Postal_Code as postalCode,
      A.Country as country,
      A.Country_Code as countryCode
    FROM Addresses A
    WHERE A.Address_ID = H.Alternate_Mailing_Address
    FOR JSON PATH, INCLUDE_NULL_VALUES, WITHOUT_ARRAY_WRAPPER
  ) AS alternativeAddress,
  H.Season_Start as alternativeAddressStart,
  H.Season_End as alternativeAddressEnd,
  H.Repeats_Annually as alternativeAddressRepeatAnnually,
  H.Household_Source_ID as householdSourceId,
  HS.Household_Source as householdSourceName,
  CAST(
  CASE 
    WHEN H.Repeats_Annually = 1 AND 
      (DATEPART(MONTH, GETDATE()) BETWEEN DATEPART(MONTH, H.Season_Start) AND DATEPART(MONTH, H.Season_End) OR
      (DATEPART(MONTH, H.Season_Start) > DATEPART(MONTH, H.Season_End) AND 
      (DATEPART(MONTH, GETDATE()) >= DATEPART(MONTH, H.Season_Start) OR DATEPART(MONTH, GETDATE()) <= DATEPART(MONTH, H.Season_End))))
    THEN 1
    WHEN GETDATE() BETWEEN H.Season_Start AND H.Season_End 
    THEN 1
    ELSE 0 
  END AS BIT
  ) as isAlternativeAddressActive,
  H.Home_Address_Unlisted as homeAddressUnlisted,
  H.Home_Phone_Unlisted as homePhoneUnlisted,
  H.Bulk_Mail_Opt_Out as bulkMailOptOut
FROM UserHousehold UH
JOIN Households H ON UH.Household_ID = H.Household_ID
LEFT JOIN Congregations Cg ON H.Congregation_ID = Cg.Congregation_ID
LEFT JOIN Household_Sources HS ON H.Household_Source_ID = HS.Household_Source_ID;
