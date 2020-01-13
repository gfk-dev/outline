// @flow
import Sequelize from 'sequelize';
import Router from 'koa-router';

import auth from '../../middlewares/authentication';
import { User, Team } from '../../models';
import { quezxAuth } from '../../../shared/utils/routeHelpers';
import * as Quezx from '../../quezx';

const Op = Sequelize.Op;
const router = new Router();

router.get('quezx', async ctx => {
  ctx.redirect(quezxAuth());
});

// signin callback from Slack
router.get('quezx.callback', auth({ required: false }), async ctx => {
  const { code } = ctx.request.query;
  ctx.assertPresent(code, 'code is required');

  const auth = await Quezx.getToken(code);

  const userData = await Quezx.getUser(auth.access_token);

  const teamName = process.env.QUEZX_TEAM || 'QuezX';
  const avatarUrl = process.env.QUEZX_TEAM_AVATAR;

  const [team, isFirstUser] = await Team.findOrCreate({
    where: {
      name: teamName,
    },
    defaults: {
      name: teamName,
      avatarUrl,
    },
  });

  try {
    const [user, isFirstSignin] = await User.findOrCreate({
      where: {
        [Op.or]: [
          {
            service: 'quezx',
            serviceId: userData.id.toString(),
          },
          {
            service: { [Op.eq]: null },
            email: userData.email,
          },
        ],
        teamId: team.id,
      },
      defaults: {
        service: 'quezx',
        serviceId: userData.id,
        name: userData.first_name,
        email: userData.email,
        avatarUrl: avatarUrl,
      },
    });

    // set cookies on response and redirect to team subdomain
    ctx.signIn(user, team, 'quezx', isFirstSignin);
  } catch (err) {
    if (err instanceof Sequelize.UniqueConstraintError) {
      const exists = await User.findOne({
        where: {
          service: 'email',
          email: userData.email,
          teamId: team.id,
        },
      });

      if (exists) {
        ctx.redirect(`${team.url}?notice=email-auth-required`);
      } else {
        ctx.redirect(`${team.url}?notice=auth-error`);
      }

      return;
    }

    throw err;
  }
});

export default router;
