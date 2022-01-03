USE WEBCHAT;

DELETE FROM `TB_USER` WHERE `id` >= 1;

INSERT INTO `WEBCHAT`.`TB_USER` (`id`, `name`, `identity`, `profile`, `created`, `updated`) VALUES (1, 'Aiden Chavez', 'AidenChavez', '/files/profile/AidenChavez.png', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
INSERT INTO `WEBCHAT`.`TB_USER` (`id`, `name`, `identity`, `profile`, `created`, `updated`) VALUES (2, 'Christian Kelly', 'ChristianKelly', '/files/profile/ChristianKelly.png', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
INSERT INTO `WEBCHAT`.`TB_USER` (`id`, `name`, `identity`, `profile`, `created`, `updated`) VALUES (3, 'Dean Henry', 'DeanHenry', '/files/profile/DeanHenry.png', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
INSERT INTO `WEBCHAT`.`TB_USER` (`id`, `name`, `identity`, `profile`, `created`, `updated`) VALUES (4, 'Monica Ward', 'MonicaWard', '/files/profile/MonicaWard.png', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
INSERT INTO `WEBCHAT`.`TB_USER` (`id`, `name`, `identity`, `profile`, `created`, `updated`) VALUES (5, 'Vincent Porter', 'VincentPorter', '/files/profile/VincentPorter.png', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
INSERT INTO `WEBCHAT`.`TB_USER` (`id`, `name`, `identity`, `profile`, `created`, `updated`) VALUES (6, 'Mike Thomas', 'MikeThomas', '/files/profile/MikeThomas.png', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

DELETE FROM `TB_HISTORY` WHERE `id` >= 1;

INSERT INTO `WEBCHAT`.`TB_HISTORY` (`id`, `userid`, `type`, `value`, `created`) VALUES (1, 1, 1, '/files/picture/AidenChavezPicture.jpg', CURRENT_TIMESTAMP());
INSERT INTO `WEBCHAT`.`TB_HISTORY` (`id`, `userid`, `type`, `value`, `created`) VALUES (2, 1, 0, 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.', CURRENT_TIMESTAMP());

INSERT INTO `WEBCHAT`.`TB_HISTORY` (`id`, `userid`, `type`, `value`, `created`) VALUES (3, 2, 1, '/files/picture/ChristianKellyPicture.jpg', CURRENT_TIMESTAMP());
INSERT INTO `WEBCHAT`.`TB_HISTORY` (`id`, `userid`, `type`, `value`, `created`) VALUES (4, 2, 0, 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.', CURRENT_TIMESTAMP());

INSERT INTO `WEBCHAT`.`TB_HISTORY` (`id`, `userid`, `type`, `value`, `created`) VALUES (5, 3, 1, '/files/picture/DeanHenryPicture.jpg', CURRENT_TIMESTAMP());
INSERT INTO `WEBCHAT`.`TB_HISTORY` (`id`, `userid`, `type`, `value`, `created`) VALUES (6, 3, 0, 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.', CURRENT_TIMESTAMP());

INSERT INTO `WEBCHAT`.`TB_HISTORY` (`id`, `userid`, `type`, `value`, `created`) VALUES (7, 4, 1, '/files/picture/MonicaWardPicture.jpg', CURRENT_TIMESTAMP());
INSERT INTO `WEBCHAT`.`TB_HISTORY` (`id`, `userid`, `type`, `value`, `created`) VALUES (8, 4, 0, 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.', CURRENT_TIMESTAMP());

INSERT INTO `WEBCHAT`.`TB_HISTORY` (`id`, `userid`, `type`, `value`, `created`) VALUES (9, 5, 1, '/files/picture/VincentPorterPicture.jpg', CURRENT_TIMESTAMP());
INSERT INTO `WEBCHAT`.`TB_HISTORY` (`id`, `userid`, `type`, `value`, `created`) VALUES (10, 5, 0, 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.', CURRENT_TIMESTAMP());

INSERT INTO `WEBCHAT`.`TB_HISTORY` (`id`, `userid`, `type`, `value`, `created`) VALUES (11, 6, 1, '/files/picture/MikeThomasPicture.jpg', CURRENT_TIMESTAMP());
INSERT INTO `WEBCHAT`.`TB_HISTORY` (`id`, `userid`, `type`, `value`, `created`) VALUES (12, 6, 0, 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.', CURRENT_TIMESTAMP());

SELECT * FROM `TB_USER` ORDER BY `id` DESC LIMIT 0, 3;

(SELECT * FROM TB_HISTORY WHERE `type`=0 AND `userid`=6 ORDER BY `id` DESC LIMIT 0, 1)
UNION
(SELECT * FROM TB_HISTORY WHERE `type`=1 AND `userid`=6 ORDER BY `id` DESC LIMIT 0, 1);

EXPLAIN
SELECT
	U.id AS idx,
    U.identity AS userid,
    U.name AS username,
    U.profile AS `profile`,
    P.value AS picture,
    C.value AS `text`
FROM
	TB_USER U
LEFT JOIN TB_HISTORY P
ON (U.id = P.userid AND P.type = 1)
LEFT JOIN TB_HISTORY C 
ON (C.type = 0 AND U.id = C.userid)
ORDER BY U.id ASC
LIMIT 0, 3;


SELECT
U.*,
P.value AS picture,
C.value AS `comment`
FROM TB_USER U
LEFT JOIN TB_HISTORY P
ON (U.id = P.userid AND P.type = 1)
LEFT JOIN TB_HISTORY C 
ON (C.type = 0 AND U.id = C.userid)
ORDER BY U.id DESC
LIMIT 0, 3;

-- '1', 'SIMPLE', 'P', NULL, 'ALL', NULL, NULL, NULL, NULL, '12', '100.00', 'Using where; Using join buffer (hash join)'
