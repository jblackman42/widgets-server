-- SELECT * FROM Household_Positions;

SELECT
  H.Household_ID as householdId,
  H.Household_Name as name,
  H.Home_Phone as homePhone,
  H.Congregation_ID as congregationId,
  C.Congregation_Name as congregationName,
  JSON_QUERY((
    SELECT
      C.Household_Position_ID as householdPositionId,
      HP.Household_Position as householdPositionName,
      C.Middle_Name as middleName,
      C.Nickname as nickname,
      C.Prefix_ID as prefixId,
      C.Suffix_ID as suffixId,
      S.Suffix as suffixName,
      P.Prefix as prefixName
    FROM Contacts C
    LEFT JOIN Household_Positions HP ON C.Household_Position_ID = HP.Household_Position_ID
    LEFT JOIN Suffixes S ON C.Suffix_ID = S.Suffix_ID
    LEFT JOIN Prefixes P ON C.Prefix_ID = P.Prefix_ID
    WHERE C.Household_ID = H.Household_ID
    FOR JSON PATH, INCLUDE_NULL_VALUES
  )) AS familyMembers,
  JSON_QUERY((
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
  )) AS address
FROM Households H
LEFT JOIN Congregations C ON H.Congregation_ID = C.Congregation_ID
WHERE H.Household_ID = 1;