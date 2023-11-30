export interface IGoogleProfile {
  id: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: [{ value: string; verified: boolean }];
}
