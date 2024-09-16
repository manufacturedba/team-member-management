export type MemberModelFields = {
  first_name: string | undefined;
  last_name: string | undefined;
  email: string | undefined;
  phone_number: string | undefined;
  role: string | undefined;
  id: number | null;
};

export type MemberModel = {
  model: string;
  pk: number;
  fields: MemberModelFields;
};
