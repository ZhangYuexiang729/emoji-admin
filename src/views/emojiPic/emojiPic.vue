<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :lg="6" :md="8" :sm="24" class="left">
        <div>
          <div>
            <h2>表情包列表</h2>
            <el-button type="primary" @click="createList()">新增</el-button>
          </div>
        </div>
        <el-menu default-active="0" class="el-menu-vertical-demo">
          <el-menu-item
            v-for="(item, index) in serviceList"
            :index="index.toString()"
            :key="index"
            @click="handleOpen(item)"
          >
            <i class="el-icon-menu"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </el-col>

      <el-col :lg="18" :md="16" :sm="24">
        <h2>{{ this.title }}</h2>
        <el-table :data="tableData" border fit highlight-current-row>
          <!-- <el-table-column label="id" align="center" prop="id">
					
					</el-table-column> -->

        
         
          <el-table-column
            label="图片详情"
            align="center"
            prop="emojiDetail"
          >
          <template slot-scope="scope">
            <img :src="scope.row.emojiDetail" width="100px">
              </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <el-table-column align="center" width="280">
              <template slot="header">
                <el-button
                  class="filter-item"
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  plain
                  @click="handleCreate()"
                  >新增
                </el-button>
                <el-button
                  type="success"
                  icon="el-icon-edit"
                  size="mini"
                  plain
                  @click="handleListUpdate()"
                >
                  编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  plain
                  @click="handleListDelete()"
                  >删除</el-button
                >
              </template>
              <template slot-scope="{ row, $index }">
                <el-button
                  v-if="!row.isRelease"
                  type="success"
                  icon="el-icon-edit"
                  size="mini"
                  plain
                  @click="handleUpdate(row)"
                >
                  编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  plain
                  @click="handleDelete($index, row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>

        <!-- <pagination :total="total" :page.sync="pageNumb" :limit.sync="pageSize" @pagination="getData" /> -->
      </el-col>
    </el-row>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="80px"
      >
      <div>
        <!-- 选择图片 -->
        <input type="file"
               multiple
               accept="image/*"
               @change="chooseImg" />
        <!-- 预览图片 -->
        <canvas ref="imgPreview"
                height="0"
                width="0"></canvas>
        <!-- 提交图片 -->
        <!-- <button @click="uploadImg">提交图片</button> -->
        <!-- 通过后台返回的url向文件服务器请求图片 -->
        <!-- <img :src="imgUrlFromServer"> -->
    </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="noUplod"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ dialogStatus === "create" ? "创建" : "更新" }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="textMap[dialogListStatus]"
      :visible.sync="dialogListFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataListForm"
        :rules="listRules"
        :model="tempList"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="表情包名称" prop="name" label-width="120px">
          <el-input v-model="tempList.name" placeholder="请输入表情包名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogListFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="
            dialogListStatus === 'create' ? createListData() : updateListData()
          "
        >
          {{ dialogListStatus === "create" ? "创建" : "更新" }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  createEmojiPicsPackage,
  deleteServicePackage,
  getServicePackage,
  updateServicePackage,
} from "@/api/emojiPic";
// import { resolve } from "path";

export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入用户账号"));
      }
      if (this.dialogStatus == "create") {
        existsUser(value).then((res) => {
          if (!res) {
            callback(new Error("账号已存在"));
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    };
    const validatePassword2 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请再次输入密码"));
      }
      if (value !== this.temp.password) {
        callback(new Error("密码不匹配"));
      } else {
        callback();
      }
    };
    return {
      createListTitle: "新建服务包",
      rules: {
        name: [
          {
            required: true,
            trigger: "blur",
            message: "不能为空",
          },
        ],
        emojiDetail: [
          {
            required: true,
            trigger: "blur",
            message: "不能为空",
          },
        ],
      },
      listRules: {
        name: [
          {
            required: true,
            trigger: "blur",
            message: "不能为空",
          },
        ],
      },
      tableData: [],
      dialogStatus: "",
      dialogListStatus: "",
      dialogFormVisible: false,
      dialogSelectRoleVisible: false,
      dialogListFormVisible: false,
      passwordType: "password",
      pageNumb: 1,
      pageSize: 10,
      total: 0,
      roles: [],
      currentRoles: [],
      currentUserRoles: [],
      currentUserId: "",
      serviceList: [],
      parentId: "",
      title: "",
      picList:[],
      temp: {
        id: "",
        name: "",
        parentId: null,
        emojiDetail: "",
      },
      tempList: {
        id: "",
        name: "",
        parentId: "",
        emojiDetail: "",
      },
      rowList: {},
      imgUrlFromServer: '#',
            base64: '',
      textMap: {
        update: "编辑表情包",
        create: "创建表情包内容",
      },
    };
  },
  computed: {},
  created() {
    this.getList();
  },
  mounted() {},
  watch: {
    parentId: {
      handler() {
        this.getDeatils();
      },
      deep: true,
    },
    confirmRes: {
      handler() {
        this.getDeatils();
      },
      deep: true,
    },
  },
  methods: {
    chooseImg (event) {
            let fileList = event.target.files
           console.log(fileList);
          for(let i=0;i<fileList.length;i++){
              let file = fileList[i]
              let reader = new FileReader()
              let img = new Image()
            // 读取图片
            reader.readAsDataURL(file)
            // 读取完毕后的操作
            reader.onloadend = (e) => {
                img.src = e.target.result
                // 这里的e.target就是reader
                // console.log(reader.result)
                // reader.result就是图片的base64字符串
                this.picList.push(reader.result)
                console.log(this.picList);
                      // 预览图片
            // let canvas = this.$refs['imgPreview']
            // let context = canvas.getContext('2d')
            // img.onload = () => {
            //     img.width = 100
            //     img.height = 100
            //     // 设置canvas大小
            //     canvas.width = 100
            //     canvas.height = 100
            //     // 清空canvas
            //     context.clearRect(0, 0, 100, 100)
            //     // 画图
            //     context.drawImage(img, 0, 0, 100, 100)
            // }
            }
          }

           
      
        },
        uploadImg () {
            // axios.post('http://1.2.3.4:8080/uploadImg', {
            //     img: this.base64
            // }).then(response => {
            //     this.imgUrlFromServer = response.data.imgUrl
            // })
        },
    

    getList() {
      let self = this;
      getServicePackage(0)
        .then((res) => {
          this.serviceList = res;
          self.parentId = res[0].id;
          self.title = res[0].name;
          self.rowList = res[0];
        })
        .catch((err) => {
          self.$notify.error(
            "获取服务包列表失败：" + err.response.data.error.message
          );
        });
    },
    noUplod(){
      this.dialogFormVisible = false
      this.picList = []
    },
    getDeatils() {
      let self = this;
      getServicePackage(self.parentId)
        .then((res) => {
          
          self.tableData = res;
        })
        .catch((err) => {
          self.$notify.error(
            "获取服务包详情失败：" + err.response.data.error.message
          );
        });
    },

    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createList() {
      this.resetListTemp();
      this.dialogListStatus = "create";
      this.dialogListFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataListForm"].clearValidate();
      });
    },
    handleOpen(item) {
      let self = this;
      self.parentId = item.id;
      
      
      self.rowList = item;
      

      this.title = item.name;
      getServicePackage(item.id)
        .then((res) => {
          this.tableData = res;
        })
        .catch((err) => {
          self.$notify.error(
            "获取服务包详情失败：" + err.response.data.error.message
          );
        });
    },

    handleUpdate(row) {
      
      this.resetTemp(row);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleListUpdate() {
      
      
      this.resetListTemp(this.rowList);
      this.dialogListStatus = "update";
      this.dialogListFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataListForm"].clearValidate();
      });
    },
    updateData() {
      let self = this;
      
      self.$refs["dataForm"].validate((valid) => {
        if (valid) {
          updateServicePackage(this.temp)
            .then((res) => {
              self.resetTemp();
              self.getDeatils();
              self.dialogFormVisible = false;
            })
            .catch((err) => {
              self.$notify.error(
                "更新失败：" + err.response.data.error.message
              );
            });
        }
      });
    },
    updateListData() {
      let self = this;
      
      self.$refs["dataListForm"].validate((valid) => {
        if (valid) {
          updateServicePackage(this.tempList)
            .then((res) => {
              self.resetListTemp();
              self.getList();
              self.dialogListFormVisible = false;
            })
            .catch((err) => {
              self.$notify.error(
                "更新失败：" + err.response.data.error.message
              );
            });
        }
      });
    },
    resetTemp(data) {
      
      this.temp = data
        ? {
            id: data.id,
            name: data.name,
            parentId: data.parentId,
            emojiDetail: data.emojiDetail,
          }
        : {
            id: "",
            name: "",
            parentId: null,
            emojiDetail: "",
          };
    },

    resetListTemp(data) {
      this.tempList = data
        ? {
            id: data.id,
            name: data.name,
            parentId: data.parentId,
            emojiDetail: data.emojiDetail,
          }
        : {
            id: "",
            name: "",
            parentId: null,
            emojiDetail: "",
          };
    },

    createData() {
      console.log(123);
      let self = this;
      let list = this.picList
      var time

          for(let i=0;i<list.length;i++){
        
            setTimeout(()=>{
            
            this.temp.parentId = self.parentId;
            this.temp.name = this.title
            this.temp.emojiDetail = list[i]
           
            delete this.temp.id;
            createEmojiPicsPackage(this.temp)
            .then((res) => {
              console.log("成功");
              this.temp = {}
              clearTimeout(time)
              time = setTimeout(() => {
                 self.getDeatils()
                 self.dialogFormVisible = false           
                  self.picList = []
              }, 100)

            })
            .catch((err) => {
              self.$notify.error(
                "创建服务项失败：" + err.response.data.error.message
              );
            });
          },2000)
        }
          
         
    
      
    },
    createListData() {
      let self = this;
      self.$refs["dataListForm"].validate((valid) => {
        
        if (valid) {
          
          this.tempList.parentId = 0;
          this.tempList.emojiDetail = "0"  
          delete this.tempList.id
          createEmojiPicsPackage(this.tempList)
            .then((res) => {
              self.resetListTemp();
              self.getList();
              self.dialogListFormVisible = false;
            })
            .catch((err) => {
              self.$notify.error(
                "创建服务包失败：" + err.response.data.error.message
              );
            });
        }
      });
    },

    async handleDelete($index, row) {
      
      const confirmRes = await this.$confirm(
        "此操作将永久删除" + row.name + ",是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if ("cancel" === confirmRes) {
        //用户点击了取消
        return this.$message.info("取消删除");
      }
      if ("confirm" === confirmRes) {
        //用户点击了确认

        deleteServicePackage(row.id).then((res) => {
          
          this.getDeatils();
        });
      }

      return this.$message.success("删除成功");
    },

    async handleListDelete() {
      
      const row = this.rowList;
      const confirmRes = await this.$confirm(
        "此操作将永久删除整个" + row.name + ",是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if ("cancel" === confirmRes) {
        //用户点击了取消
        return this.$message.info("取消删除");
      }
      if ("confirm" === confirmRes) {
        //用户点击了确认

        deleteServicePackage(row.id).then((res) => {
          
          this.getList();
        });
      }

      return this.$message.success("删除成功");
    },
  },
};
</script>

<style scoped>
.show-pwd {
  position: absolute;
  right: 10px;
  font-size: 16px;
  color: blue;
  cursor: pointer;
  user-select: none;
}
.left{
  height: 800px;
  overflow: scroll;
}
.left::-webkit-scrollbar {display:none}
</style>
