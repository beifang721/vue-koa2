<template>
    <div>
        <div class="navbar-div">
            <van-nav-bar title="商品详情" left-text="返回" left-arrow @click-left="onClickLeft" />
        </div>
        <div class="topimage-div">
            <img :src="goodsInfo.IMAGE1" width="100%" />
        </div>
        <div class="goods-name">{{goodsInfo.NAME}}</div>
        <div class="goods-price">价格：{{goodsInfo.PRESENT_PRICE | moneyFilter}}</div>
        <div>
            <van-tabs swipeable sticky>
                <van-tab title="商品详情">
                    <div class="detail" v-html="goodsInfo.DETAIL">
                    </div>
                </van-tab>
                <van-tab title="评价">
                    正在制作中
                </van-tab>
            </van-tabs>
        </div>
        <div class="goods-bottom">
            <div>
                <van-button size="large" type="primary">加入购物车</van-button>
            </div>
            <div>
                <van-button size="large" type="danger">直接购买</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import axiox from "axios";
import url from "@/serviceAPI.config.js";
import { Toast } from "vant";
import { toMoney } from "@/filter/moneyFilter.js";
export default {
  data() {
    return {
      goodsId: "",
      goodsInfo: ""
    };
  },
  created() {
    this.goodsId = this.$route.query.goodsId;
    this.getInfo();
  },
  filters: {
    moneyFilter(money) {
      return toMoney(money);
    }
  },
  methods: {
    getInfo() {
      axiox({
        url: url.getDetailGoodsInfo,
        method: "post",
        data: {
          goodsId: this.goodsId
        }
      })
        .then(res => {
          console.log(res);
          if (res.data.code === 200 && res.data.message) {
            this.goodsInfo = res.data.message;
          } else {
            Toast("服务器错误，数据取得失败");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    onClickLeft() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.goods-name {
  background-color: #fff;
}
.goods-price {
  background-color: #fff;
}
.detail {
  font-size: 0px;
}
.goods-bottom {
  position: fixed;
  bottom: 0px;
  left: 0px;
  background-color: #fff;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-flow: nowrap;
}

.goods-bottom > div {
  flex: 1;
  padding: 5px;
}
</style>