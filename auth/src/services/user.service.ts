import { User } from '../models/User';
import { Role } from '../models/Role';
import { Document } from 'mongoose';
import { RoleDoc } from './role.service';
import { ROLE } from './jwt.service';

interface UserAttrs {
	username: string;
	password: string;
	roles: typeof Role[];
}

export interface UserDoc extends Document {
	username: string;
	password: string;
	roles: typeof Role[];
}

class UserService {
	public async findById(id: string) {
		return (await User.findById(id).populate('roles')) as UserDoc;
	}

	public async create(attrs: UserAttrs) {
		return (await User.create(attrs)) as UserDoc;
	}

	public async findByUsername(username: string) {
		return (await User.findOne({
			username,
		}).populate('roles')) as UserDoc;
	}

	public hasRole(user: UserDoc, givenRole: ROLE) {
		for (const role of user.roles.map((role) => role.name)) {
			if (role === givenRole) {
				return true;
			}
		}

		return false;
	}
}

export default new UserService();
