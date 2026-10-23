export type Member = {
    id:          string;
    dateOfBirth: Date;
    imageUrl:    string;
    displayName: string;
    created:     Date;
    lastUpdated: Date;
    lastActive: Date;
    gender:      string;
    description: string;
    country:     string;
    city:        string;
}

export type Photo = {
    id:       number;
    url:      string;
    publicId: null;
    memberId: string;
    isApproved: boolean;
}

export type EditableMember = {
    displayName: string;
    description?: string;
    city: string;
    country: string;
}

export class MemberParams {
    gender?: string;
    minAge = 18;
    maxAge = 100;
    pageNumber = 1;
    pageSize = 10;
    orderBy = 'lastActive';
}