export interface UserData {
	displayName:string;
	mail:string;
}

export interface Account {
	displayName:string;
	mail:string;
	lastSeen:number;
}

export interface DBAccount {
	id:number;
	displayName:string;
	mail:string;
	lastSeen:number;
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