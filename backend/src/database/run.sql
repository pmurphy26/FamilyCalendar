/*SELECT setval(
  pg_get_serial_sequence('familyindividuals', 'id'),
  (SELECT COALESCE(MAX(id), 0) FROM familyindividuals) + 1,
  false
);*/
/*INSERT INTO Vehicle (vehicleName, numPeopleCanFit, familyID) VALUES ('Palisade', 5, 0);*/
SELECT * FROM calendarevent;
/*UPDATE familyindividuals SET colorstr='#b630ba' WHERE id=3;*/