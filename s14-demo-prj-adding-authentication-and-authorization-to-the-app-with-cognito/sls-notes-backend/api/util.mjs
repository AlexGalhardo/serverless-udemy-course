export const getUserId = (headers) => {
  return headers.app_user_id;
};

export const getUserName = (headers) => {
  return headers.app_user_name;
};

export const getIdToken = (headers) => {
  return headers.Authorization;
};

export const getResponseHeaders = () => {
  return {
    "Access-Control-Allow-Origin": "*",
  };
};
