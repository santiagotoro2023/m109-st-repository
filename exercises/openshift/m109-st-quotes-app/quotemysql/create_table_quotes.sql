USE quotesdb;
GO
CREATE TABLE quotes (
	Id int AUTO_INCREMENT NOT NULL,
	quotation varchar(255) NULL,
	author varchar(50) NULL,
	PRIMARY KEY ( Id )
);
GO