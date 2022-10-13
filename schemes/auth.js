import { LocalScheme } from '~auth/runtime'

export default class CustomScheme extends LocalScheme {

    async login (endpoint) {
        let data = await fetch('http://localhost:3001/nextcloud/login', { method: 'GET' })
        data = await data.json()
        await window.open(data.login, '_blank')
        let token = await fetch('http://localhost:3001/nextcloud/login/' + data.poll.token)
        token = await token.json()

        let user = await fetch('http://localhost:3001/nextcloud/me', {
            method: 'GET',
            headers: {
                'x-auth-token': token.token
            }
        }).catch(err => {
            console.log(err)
        })

        user = await user.json()
        this.$auth.setUserToken(token.token)
        this.$auth.setUser(user)

        return user
    }

    async logout () {
        this.$auth.setUserToken('')
        this.$auth.setUser({})
        return true
    }

    async fetchUser () {
        let user = await fetch('http://localhost:3001/nextcloud/me', {
            method: 'GET',
            headers: {
                'x-auth-token': this.$auth.getToken('local')
            }
        }).catch(err => {
            console.log(err)
        })

        user = await user.json()
        this.$auth.setUser(user)
        return user
    }

}