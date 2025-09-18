import { PrismaClient, RoleType } from '../generated/prisma'
import { rolePremission } from '../utilities/role-permission'

const prisma = new PrismaClient()

async function main(){
    console.log("Seeding roles and permission")
    for (const rolekey of Object.keys(rolePremission)){
        console.log(rolekey)
        const role =await prisma.role.upsert({
            where:{role:rolekey as RoleType  },
            update:{},
            create:{
                role:rolekey as RoleType,
            }
        })
        console.log(`Role ensured ${role.role}`)
        for (const permission of rolePremission[rolekey as RoleType]){
            console.log(permission)
            await prisma.rolePermission.upsert({
                where:{
                    roleId_permission: {
                        roleId:role.id,
                        permission:permission
                    },
                },
                update:{},
                create:{
                    roleId:role.id,
                    permission,
                }
            })
            console.log(`Permissions synced for ${role.role}`)
        }
        console.log("Seeding completed")
    }
}
main()
.then(()=>prisma.$disconnect())
.catch((error)=>{
    console.error(error)
    prisma.$disconnect()
    process.exit(1)
})
