export interface Int_Newsletter {
  id: string;
  email: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockNewsletters: Int_Newsletter[] = [
  {
    id: '1',
    email: 'test1@example.com',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  {
    id: '2',
    email: 'test2@example.com',
    active: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'searchedData1@example.com',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    email: 'searchedData2@example.com',
    active: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
