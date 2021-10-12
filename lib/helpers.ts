// Copyright (C) 2021 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.

export const toQueryString = (data: Record<string, unknown>): string => Object.keys(data)
  .map(key => `${key}=${urlsafe(data[key])}`)
  .join('&')


export const urlsafe = (v: unknown): string => {
  if (typeof v === 'string') return v.replace(/ /g, '%20')
  return `${v}`
}
