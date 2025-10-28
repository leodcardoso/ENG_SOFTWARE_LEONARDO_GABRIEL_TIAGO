export interface IRankingUser {
  id: string;
  name: string;
  score: number;
  position: number;
}

export default class RankingModel {
  users: IRankingUser[];

  constructor(users: IRankingUser[] = []) {
    this.users = users;
  }

  static fromApi(data: any[]): RankingModel {
    const users = data.map((item, index) => ({
      id: item.id,
      name: item.userName,
      score: item.points,
      position: index + 1,
    }));
    return new RankingModel(users);
  }
}
