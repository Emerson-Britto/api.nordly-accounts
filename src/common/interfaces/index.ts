export interface UserData {
	displayName:string;
	mail:string;
}

export interface Account {
	displayName:string;
	mail:string;
	lastSeen:number;
	verified:number;
}

export interface DBAccount {
	id:number;
	displayName:string;
	mail:string;
	lastSeen:number;
	verified:number;
}

export interface TokenInfor {
	lastAccess:number;
}

export interface MailData {
  from:string;
  to:string;
  subject:string;
  text:string;
  html:string;
}

export interface LoginInfor {
	status:string;
	mail:string;
	ip:string;
	date:string;
	time:string;
	location:string;
	ISP:string;
	hostname:string;
	countryCode:string;
	os:string;
	userAgent:string;
}