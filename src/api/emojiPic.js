import request from '@/utils/request'
export function getServicePackage(id) {
	return request({
		url: 'emojiPics/nextServerListData?id=' + id,
		method: 'get',
		
	})
}


export function createEmojiPicsPackage(data) {
	return request({
		url: 'emojiPics',
		method: 'post',
		data
	})
}

export function updateServicePackage(data) {
	return request({
		url: "serverPackLists",
		method: "patch",
		data
	})
}


export function deleteServicePackage(id) {
	return request({
		url: "emojiPics/" + id,
		method: "delete"
	})
}


