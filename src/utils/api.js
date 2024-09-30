import { API_POST_URL, API_AUTH_URL, API_CHAT_URL, API_USER_URL, API_FRIEND_URL, API_SCHOOL_URL, API_NATION_URL } from './constants';

export const headers = (token) => ({
  Authorization: `Bearer ${token}`,
});

// Auth APIs
export const signIn = (provider, email, password) => {
    return fetch(`${API_AUTH_URL}/signin`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider, email, password }),
    }).then((res) => res.json());
};

export const signUp = (name, email, password) => {
    return fetch(`${API_AUTH_URL}/signup`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    }).then((res) => res.json());
};

// Post APIs
export const getRecommendedPosts = (token) =>
  fetch(`${API_POST_URL}/recommended`, {
    headers: headers(token),
  }).then((res) => res.json());


export const getSavedPosts = (token) =>
  fetch(`${API_POST_URL}/saved`, {
    headers: headers(token),
  }).then((res) => res.json());

export const getPostDetail = (postId, token) =>
  fetch(`${API_POST_URL}/${postId}`, {
    headers: headers(token),
  }).then((res) => res.json());

export const createNewPost = (formData, token) =>
  fetch(`${API_POST_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).then((res) => res.json());

export const editPost = (postId, formData, token) =>
  fetch(`${API_POST_URL}/${postId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).then((res) => res.json());

export const deletePost = (postId, token) =>
  fetch(`${API_POST_URL}/${postId}`, {
    method: 'DELETE',
    headers: headers(token),
  }).then((res) => res.json());

export const savePost = (postId, token) =>
  fetch(`${API_POST_URL}/${postId}/save`, {
    method: 'POST',
    headers: headers(token),
  }).then((res) => res.json());

export const unsavePost = (postId, token) =>
  fetch(`${API_POST_URL}/${postId}/save`, {
    method: 'DELETE',
    headers: headers(token),
  }).then((res) => res.json());

export const addComment = (postId, content, token) =>
  fetch(`${API_POST_URL}/${postId}/comment`, {
    method: 'POST',
    headers: {
      ...headers(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  }).then((res) => res.json());

export const deleteComment = (postId, commentId, token) =>
  fetch(`${API_POST_URL}/${postId}/comment/${commentId}`, {
    method: 'DELETE',
    headers: headers(token),
  }).then((res) => res.json());

export const getUserPosts = (userId, token) =>
  fetch(`${API_POST_URL}/user/${userId}`, {
    headers: headers(token),
  }).then((res) => res.json());

// chat
  export const getChatSessions = (token) =>
    fetch(`${API_CHAT_URL}/sessions`, {
      headers: headers(token),
    }).then((res) => res.json());
  
  export const getChatHistory = (token, chatId, page = 0, size = 30) =>
    fetch(`${API_CHAT_URL}/history?chatId=${chatId}&page=${page}&size=${size}`, {
      headers: headers(token),
    }).then((res) => res.json());

// User APIs
export const getMyProfile = (token) =>
  fetch(`${API_USER_URL}/me/profile`, {
    headers: headers(token),
  }).then((res) => res.json());

export const getUserProfile = (userId, token) =>
  fetch(`${API_USER_URL}/${userId}/profile`, {
    headers: headers(token),
  }).then((res) => res.json());

export const updateUserProfileApi = (token, profileData) => {

  return fetch(`${API_USER_URL}/profile`, {
    method: 'PUT',
    headers: {
      ...headers(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  })
  .then((res) => res.json());
};

export const getUsersFromOrToSameSchool = (token) =>
  fetch(`${API_USER_URL}/same-school`, {
    headers: headers(token),
  }).then((res) => res.json());

export const updateInterestedSchools = (token, schoolIds) => {
  return fetch(`${API_USER_URL}/interested-schools`, {
    method: 'PUT',
    headers: {
      ...headers(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(schoolIds),
  }).then((res) => res.json());
};

export const deleteAllInterestedSchools = (token) => {
  return fetch(`${API_USER_URL}/interested-schools`, {
    method: 'DELETE',
    headers: {
      ...headers(token),
    },
  }).then((res) => res.json());
};

export const updateUserPhase = (token, phase) => {
  return fetch(`${API_USER_URL}/me/phase`, {
    method: 'PUT',
    headers: {
      ...headers(token),
      'Content-Type': 'application/json',
    },
    body: phase,
  }).then((res) => res.json());
};

export const updateUserExchangeSchool = (token, schoolId) => {
  return fetch(`${API_USER_URL}/me/exchange-school`, {
    method: 'PUT',
    headers: {
      ...headers(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(schoolId),
  }).then((res) => res.json());
};

export const updateUserOriginSchool = (token, schoolId) => {
  return fetch(`${API_USER_URL}/me/origin-school`, {
    method: 'PUT',
    headers: {
      ...headers(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(schoolId),
  }).then((res) => res.json());
};

// Friend APIs
export const getPendingFriendRequests = (token) =>
  fetch(`${API_FRIEND_URL}/pending`, {
    headers: headers(token),
  }).then((res) => res.json());

export const getUserFriends = (token) =>
  fetch(`${API_FRIEND_URL}/list`, {
    headers: headers(token),
  }).then((res) => res.json());

export const rejectFriendRequestApi = (token, userId, targetUserId) => {
  fetch(`${API_FRIEND_URL}/rejectRequest`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, targetUserId })
  }).then((res) => res.json());
};

// School APIs
export const getSchools = (token, nationId = null, name = null) => {
  let url = `${API_SCHOOL_URL}?`;

  if (nationId) {
    url += `nationId=${nationId}`;
  } else if (name) {
    url += `name=${name}`;
  }

  return fetch(url, {
    method: 'GET',
    headers: {
      ...headers(token),
    },
  }).then((res) => res.json());
};

export const getSchoolEmailDomain = (token, schoolId) => {
  return fetch(`${API_SCHOOL_URL}/${schoolId}/email-domain`, {
    method: 'GET',
    headers: {
      ...headers(token),
    },
  }).then((res) => res.json());
};

// Nation API
export const getAllNations = () => {
  return fetch(`${API_NATION_URL}/list`)
  .then((res) => res.json());
};