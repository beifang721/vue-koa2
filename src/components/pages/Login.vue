<template>
    <div>
        <van-nav-bar title="用户登录" left-text="返回" left-arrow @click-left="goBack" />
        <div class="register-panel">
            <van-field v-model="username" label="用户名" icon="clear" placeholder="请输入用户名" :error-message="usernameErrorMsg"
                required @click-icon="username = ''" />
            <van-field v-model="password" type="password" label="密码" placeholder="请输入密码" :error-message="passwordErrorMsg"
                required />
            <div class="register-button">
                <van-button type="primary" @click="LoginAction" :loading="openLoading" size="large">登陆</van-button>
            </div>

        </div>


    </div>
</template>

<script>
    import axios from "axios";
    import url from "@/serviceAPI.config.js";
    import { Toast } from "vant";
    export default {
        data() {
            return {
                username: "",
                password: "",
                openLoading: false,
                usernameErrorMsg: "", //当用户名出现错误的时候
                passwordErrorMsg: "" //当密码出现错误的时候
            };
        },
        methods: {
            goBack() {
                this.$router.go(-1);
            },
            LoginAction() {
                this.checkForm() && this.axiosRegisterUser();
            },
            axiosRegisterUser() {
                this.openLoading = true;
                axios({
                    url: url.login,
                    method: "post",
                    data: {
                        userName: this.username,
                        password: this.password
                    }
                }).then(res => {
                    console.log(res);
                    this.openLoading = false;
                    if (res.data.code === 200 && res.data.message) {
                        new Promise((resolve, reject) => {
                            localStorage.userInfo = { username: this.userName }
                            setTimeout(() => {
                                resolve()
                            }, 500)
                        }).then(() => {
                            Toast.success('登录成功')
                            this.$router.push('/')
                        }).catch(() => {
                            Toast.fail('登录状态保存失败')
                        })
                        this.$router.push('/')
                    } else {
                        Toast.fail("登陆失败");
                    }
                })
                .catch(e => {
                    this.openLoading = false;
                    Toast.fail("登陆失败");
                });
            },
            checkForm() {
                let isOk = true;
                if (this.username.length < 5) {
                     this.usernameErrorMsg = "用户名不能小于5位";
                    isOk = false;
                } else {
                    this.usernameErrorMsg = "";
                }
                if (this.password.length < 6) {
                    this.passwordErrorMsg = "密码不能少于6位";
                    isOk = false;
                } else {
                    this.passwordErrorMsg = "";
                }
                return isOk;
            }
        },
        created(){
            if(localStorage.userInfo){
                Toast.success('您已经登录')
                this.$router.push('/')
            }
        }
    };
</script>

<style scoped>
    .register-panel {
        width: 96%;
        border-radius: 5px;
        margin: 20px auto;
        padding-bottom: 50px;
    }

    .register-button {
        padding-top: 10px;
    }
</style>