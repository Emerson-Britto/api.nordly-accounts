export interface UserData {
	displayName:String;
	mail:String;
}

export interface Account {
	displayName:String;
	mail:String;
	lastSeen:Number;
}

export interface DBAccount {
	id:Number;
	displayName:String;
	mail:String;
	lastSeen:Number;
}