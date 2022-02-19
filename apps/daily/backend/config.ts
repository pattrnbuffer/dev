export const config = {
  notion: {
    token: process.env.NOTION_TOKEN as string,
    database_id: process.env.NOTION_DB_ID as string,
  },
};
