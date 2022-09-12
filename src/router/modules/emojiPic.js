/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const emojiPicRouter = {
	path: '/emojiPic',
	component: Layout,
	redirect: '/emojiPic/emojiPic',
	alwaysShow: true, // will always show the root menu
	name: 'emojiPic',
	meta: {
		title: '表情包',
		icon: 'tree',
		// roles: ['超级管理员'] // you can set roles in root nav
	},
	children: [{
		path: 'emojiPic',
		component: () => import('@/views/emojiPic/emojiPic'),
		name: 'emojiPicDeatils',
		meta: {
			title: '表情包详情',
			// icon:"user"
			// roles: ['超级管理员'] // or you can only set roles in sub nav
		}
	},



],



}
export default emojiPicRouter
