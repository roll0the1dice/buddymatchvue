export type UserType = {
  id: number,
  tagName: string,
  userId: number, 
  parentId: number, 
  isParent: number, 
  createTime: Date 
  updateTime: Date,
  isDelete: number,
  displayName: string,
  personalBio: string,
  username: string,
  password: string,
  avatar: string,
};


export type UserTagType = {
  text: string,
  id: number,
};

export type TeamType = {
  id: number,
  description: string,
  maxNum: number,
  expireTime: Date,
  userId: number,
  createTime: Date,
  updateTime: Date,
  isDelete: number,
  teamStatus: string,
  teamName: string,
  avatar: string,
  hasJoinNum: number,
  hasJoin: number,
  password: string,
};