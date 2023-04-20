import request from './request';

export async function doFetch({ url, params, method }) {
  return request(url, {
    method: method ?? 'post',
    data: params,
  });
}

export async function postFetch({ url, params }) {
  return request(url, {
    method: 'post',
    data: params,
  });
}

export async function getFetch({ url, params }) {
  return request(url, {
    method: 'get',
    params,
  });
}

export async function formFetch({ url, params }) {
  return request(url, {
    method: 'post',
    data: params,
    type: 'form',
  });
}
