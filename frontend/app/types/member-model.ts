export type MemberModelFields = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  role?: string;
  id?: number;
};

export type MemberModel = {
  model: string;
  pk: number;
  fields: MemberModelFields;
};
