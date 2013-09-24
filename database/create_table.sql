create database talkmob CHARACTER SET utf8;

use talkmob;

create table user(
	id MEDIUMINT NOT NULL AUTO_INCREMENT,
	name char(30) not null,
	pass char(30) not null,
	mail char(50) not null,
	gender int(1) not null,
	tw_name char(30),
	fb_name char(30),
	primary key (id)
);

create table user_tag(
	id MEDIUMINT NOT NULL,
	tagid int(5) not null,
	primary key (id,tagid)
);

create table tag(
	tagid int(5) not null,
	tagname char(100) not null,
	primary key (tagid)
);
insert into tag (tagid,tagname) values (1,'原発');
insert into tag (tagid,tagname) values (2,'憲法');
insert into tag (tagid,tagname) values (3,'TPP');
insert into tag (tagid,tagname) values (4,'日中・日韓');
insert into tag (tagid,tagname) values (5,'消費税');
insert into tag (tagid,tagname) values (6,'日米安全保障');
insert into tag (tagid,tagname) values (7,'震災復興');
insert into tag (tagid,tagname) values (8,'教育');


create table theme(
	themeid MEDIUMINT NOT NULL AUTO_INCREMENT,
	tagid int(5) not null,
	title char(100) not null,
	start datetime,
	end datetime,
	primary key (themeid)
);
insert into theme (tagid,title,start,end) values (1,'原発について話そう',NOW(),DATE_ADD(NOW(), INTERVAL 3 DAY));
insert into theme (tagid,title,start,end) values (2,'憲法９条について話そう',NOW(),DATE_ADD(NOW(), INTERVAL 3 DAY));
insert into theme (tagid,title,start,end) values (3,'TPPについて話そう',NOW(),DATE_ADD(NOW(), INTERVAL 3 DAY));
insert into theme (tagid,title,start,end) values (4,'尖閣諸島を守るために武力で他国を排除すべきか',NOW(),DATE_ADD(NOW(), INTERVAL 3 DAY));
insert into theme (tagid,title,start,end) values (5,'消費税で社会保障は改善されるか',NOW(),DATE_ADD(NOW(), INTERVAL 3 DAY));
insert into theme (tagid,title,start,end) values (6,'沖縄にある米軍基地はすべて移設すべきか',NOW(),DATE_ADD(NOW(), INTERVAL 3 DAY));
insert into theme (tagid,title,start,end) values (2,'憲法９条は何が問題なの？',NOW(),DATE_ADD(NOW(), INTERVAL 3 DAY));
insert into theme (tagid,title,start,end) values (3,'TPPで日本は豊かになる？',NOW(),DATE_ADD(NOW(), INTERVAL 3 DAY));


create table talkroom(
	roomid MEDIUMINT NOT NULL AUTO_INCREMENT,
	themeid MEDIUMINT NOT NULL,
	start datetime,
	end datetime,
	primary key (roomid)
);
insert into talkroom (themeid,start,end) values (1,NOW(),DATE_ADD(NOW(), INTERVAL 3 DAY));
insert into talkroom (themeid,start,end) values (1,NOW(),DATE_ADD(NOW(), INTERVAL 3 DAY));
insert into talkroom (themeid,start,end) values (2,NOW(),DATE_ADD(NOW(), INTERVAL 3 DAY));
insert into talkroom (themeid,start,end) values (3,NOW(),DATE_ADD(NOW(), INTERVAL 3 DAY));
insert into talkroom (themeid,start,end) values (4,NOW(),DATE_ADD(NOW(), INTERVAL 3 DAY));
insert into talkroom (themeid,start,end) values (5,NOW(),DATE_ADD(NOW(), INTERVAL 3 DAY));

create table talkroom_member(
	roomid MEDIUMINT NOT NULL,
	id MEDIUMINT NOT NULL,
	deleteflag tinyint(1) ,
	primary key (roomid,id)
);
insert into talkroom_member (roomid,id,deleteflag) values (1,1,0);
insert into talkroom_member (roomid,id,deleteflag) values (1,2,0);
insert into talkroom_member (roomid,id,deleteflag) values (2,3,0);
insert into talkroom_member (roomid,id,deleteflag) values (3,4,0);

create table talkroom_chat(
	chatid INT NOT NULL AUTO_INCREMENT,
	roomid MEDIUMINT NOT NULL ,
	id MEDIUMINT NOT NULL,
	likescore INT ,
	warnscore INT,
	deleteflag tinyint(1),
	message char(255),
	createdate datetime,
	primary key (chatid,roomid,id)
);
insert into talkroom_chat (roomid,id,likescore,warnscore,deleteflag,message,createdate) values (1,1,0,0,0,'おはよう１',NOW());
insert into talkroom_chat (roomid,id,likescore,warnscore,deleteflag,message,createdate) values (1,2,0,0,0,'おはよう２',NOW());
insert into talkroom_chat (roomid,id,likescore,warnscore,deleteflag,message,createdate) values (2,1,0,0,0,'こんばんは１',NOW());
insert into talkroom_chat (roomid,id,likescore,warnscore,deleteflag,message,createdate) values (2,2,0,0,0,'こんばんは２',NOW());

create table chat_like(
	chatid INT NOT NULL,
	id INT NOT NULL,
	primary key (chatid,id)
);
create table chat_warn(
	chatid INT NOT NULL,
	id INT NOT NULL,
	primary key (chatid,id)
);
create table occupation(
	occupationid MEDIUMINT NOT NULL AUTO_INCREMENT,
	notation char(100) not null,
	primary key (occupationid)
);
insert into occupation (notation) values ('営業・販売・サービス系');
insert into occupation (notation) values ('事務・オフィス系');
insert into occupation (notation) values ('クリエイティブ系');
insert into occupation (notation) values ('IT・技術系');
insert into occupation (notation) values ('医療・介護系');
insert into occupation (notation) values ('美容・教育系');
insert into occupation (notation) values ('工場・物流・土木建築系');
insert into occupation (notation) values ('飲食・コンビニ・施設系');

create table user_occupation(
	id MEDIUMINT NOT NULL,
	occupationid MEDIUMINT NOT NULL ,
	primary key (id,occupationid)
);