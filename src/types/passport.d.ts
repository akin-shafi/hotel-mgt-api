// // src/passport.ts
// import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
// import passport from 'passport';
// import { User } from '../entities/UserEntity'; // Adjust the import path as needed

// const secret = process.env.JWT_SECRET || 'your-secret-key';

// const opts: StrategyOptions = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: secret,
// };

// passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
//   // Here you can find the user from your database if needed
//   // For now, assuming the payload contains user information
//   const user: User = { id: jwt_payload.userId, role: jwt_payload.role }; // Adjust as needed

//   return done(null, user);
// }));

// export default passport;
