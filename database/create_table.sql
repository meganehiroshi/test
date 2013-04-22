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


create table meeting(
	meetingid MEDIUMINT NOT NULL AUTO_INCREMENT,
	tagid int(5) not null,
	title char(100) not null,
	start datetime,
	end datetime,
	primary key (meetingid)
);
insert into meeting (tagid,title,start,end) values (1,'原発について話そう',NOW(),DATE_ADD(NOW(), INTERVAL 3 DAY));
insert into meeting (tagid,title,start,end) values (2,'憲法９条について話そう',NOW(),DATE_ADD(NOW(), INTERVAL 3 DAY));
insert into meeting (tagid,title,start,end) values (3,'TPPについて話そう',NOW(),DATE_ADD(NOW(), INTERVAL 3 DAY));
insert into meeting (tagid,title,start,end) values (4,'尖閣諸島を守るために武力で他国を排除すべきか',NOW(),DATE_ADD(NOW(), INTERVAL 3 DAY));
insert into meeting (tagid,title,start,end) values (5,'消費税で社会保障は改善されるか',NOW(),DATE_ADD(NOW(), INTERVAL 3 DAY));
insert into meeting (tagid,title,start,end) values (6,'沖縄にある米軍基地はすべて移設すべきか',NOW(),DATE_ADD(NOW(), INTERVAL 3 DAY));

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