import { LocalScheme } from '~auth/runtime'

export default class CustomScheme extends LocalScheme {

    async login () {
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
        let user = await fetch('http://localhost:3001/nextcloud/me', {
            method: 'GET',
            headers: {
                'x-auth-token': this.$auth.strategy.token.get().replace('Bearer ', '')
            }
        }).catch(err => {
            console.log(err)
        })
        if (user.status == 200) {
            user = await user.json()
            this.$auth.setUser(user)
        } else {
            this.$auth.reset()
        }
        
        return user
    }

}