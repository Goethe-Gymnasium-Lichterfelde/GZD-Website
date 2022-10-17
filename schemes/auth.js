import { LocalScheme } from '~auth/runtime'

export default class CustomScheme extends LocalScheme {

    async login (endpoint) {
        let data = await fetch('https://api.togert.org/nextcloud/login', { method: 'GET' })
        data = await data.json()
        await window.open(data.login, '_blank')
        let token = await fetch('https://api.togert.org/nextcloud/login/' + data.poll.token)
        token = await token.json()

        let user = await fetch('https://api.togert.org/nextcloud/me', {
            method: 'GET',
            headers: {
                'x-auth-token': token.token
            }
        }).catch(err => {
            console.log(err)
        })

        user = await user.json()
        this.$auth.strategy.token.set(token.token)
        this.$auth.strategy.token.sync()
        this.$auth.setUser(user)

        return user
    }

    async logout () {
        this.$auth.strategy.token.set(null)
        this.$auth.setUser({})
        return true
    }

    async fetchUser () {
        let user = await fetch('https://api.togert.org/nextcloud/me', {
            method: 'GET',
            headers: {
                'x-auth-token': this.$auth.strategy.token.get().replace('Bearer ', '')
            }
        }).catch(err => {
            console.log(err)
        })

        user = await user.json()
        this.$auth.setUser(user)
        return user
    }

}