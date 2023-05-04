function difftime(start, end) {
  const diffInMs = start.diff(end);
  if (diffInMs < 60 * 60 * 1000) {
    // 时间差小于 1 小时，转为分钟
    const diffInMinutes = Math.round(diffInMs / (60 * 1000));
    return diffInMinutes + "分钟前";
  } else {
    // 时间差大于等于 1 小时，继续判断是否超过 24 小时
    const diffInHours = Math.round(diffInMs / (60 * 60 * 1000));
    if (diffInHours >= 24) {
      // 时间差超过 24 小时，转为天
      const diffInDays = Math.round(diffInHours / 24);
      return diffInDays + "天前";
    } else {
      // 时间差在 1 小时到 24 小时之间，直接输出小时数
      return diffInHours + "小时前";
    }
  }
}

export default difftime;
