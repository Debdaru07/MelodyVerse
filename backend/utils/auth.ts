import jwt from 'jsonwebtoken';

export function generateJWT(userId: string) {

    const secret = process.env.JWT_SECRET || "Random pass";

    const token = jwt.sign(
        { 
            userId, 
            lastActivity: Date.now() 
        }, 
        secret, 
        { 
            expiresIn: '1d' 
        }
    );
    return token;
}

// export const verifyJWT = async (req) => {
//     try {
//       const authHeader = req.header("Authorization");
//       const token =
//         authHeader && authHeader.startsWith("Bearer ")
//           ? authHeader.substring(7)
//           : null;
  
//       if (!token) {
//         const error = new Error("ERR21");
//         error.statusCode = 401;
//         throw error;
//       }
//       const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//       const user = await prisma.user.findFirst({
//         where: {
//           XipperID: decodedToken.userId
//         },
//         include: {
//           company: {
//             include: {
//               businessUnit: true
//             }
//           },
//           role: true,
//           documents: true,
//           address: {
//             where: {
//               isPrimary: true
//             }
//           },
//           contactNumbers: {
//             where: {
//               isPrimary: true
//             },
//             select: {
//               number: true
//             }
//           },
//           contactEmails: {
//             where: {
//               isPrimary: true
//             },
//             select: {
//               email: true
//             }
//           },
//           employee: {
//             select: {
//               companyId: true,
//               role: true,
//               businessUnit: {
//                 select: {
//                   companyBusinessUnit: {
//                     select: {
//                       hotel: {
//                         select: {
//                           XipperID: true
//                         }
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       });
      
//       if (!user) {
//         const error = new Error("ERR8");
//         throw error;
//       }
//       return user;
//     } catch (error) {
//       throw error;
//     }
//   };